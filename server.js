const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('./models/pet');
const bodyParser = require('body-parser');

const DBURL = process.env.MONGODB_URI || 'mongodb://localhost/updog';
mongoose.connect(DBURL);

// short circuiting
const port = process.env.PORT || 8080;

// use() sets up middleware
app.use(express.static('public/'));

app.use(bodyParser.json());

router.route('/')
	.get((req, res) => {
		res.send({
			message: "What's updog? 🐶"
		});
	})

router.route('/pets')
	.get((req, res) => {
		// Get all the pets
		const query = req.query;
		const pet = Pet.find();

		if (query.order_by === 'score') {
			pet.sort({
				score: -1
			});
		}

		pet.exec((err, docs) => {
			if (err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(docs);
		});
	})
	.post((req, res) => {
		const body = req.body;
		const pet = new Pet(body);

		// stores it to the database similar to the .insert() method in mongodb
		pet.save((err, doc) => {
			if (err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(doc);
		});
	});

router.route('/pets/:pet_id')
	.get((req, res) => {
		const params = req.params;
		Pet.findOne({ _id: params.pet_id }, (err, doc) => {
			if (err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(doc);
		});
	})
	.put((req, res) => {
		Pet.findById(req.params.pet_id, (err, doc) => {
			if (err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}

			// Merge a new body to the existing doc
			Object.assign(doc, req.body, {score: doc.score += 1});

			doc.save((err, savedDoc) => {
				if(err !== null) {
					res.status(400)
						.send({
							error: err
						});
					return;
				}
				res.send(savedDoc);
			});
		});
	})
	.delete((req, res) => {
		Pet.findByIdAndRemove(req.params.pet_id, (err, doc) => {
			if (err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send({
					success: "Pet deleted 🙅🏻"
				});
		});
	});

app.use('/api', router);

app.listen(port);