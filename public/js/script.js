const updog = {};

updog.getDogs = () => {
	return $.ajax({
		url: '/api/pets',
		dataType: 'json',
		data: {
			order_by: 'score'
		}
	});
};

updog.createDog = (data) => {
	return $.ajax({
		url: '/api/pets',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: JSON.stringify(data),
	});
};

updog.upvote = (id) => {
	return $.ajax({
		url: `/api/pets/${id}`,
		method: 'PUT',
		dataType: 'json'
	});
};

updog.delete = (id) => {
	return $.ajax({
		url: `/api/pets/${id}`,
		method: 'DELETE',
		dataType: 'json'
	});
};

updog.displayDogs = (dogs) => {
	$('#dogos').empty();
	dogs.forEach((dog) => {
		const $container = $("<div>").addClass('dogo');
		const $closeBtn = $('<i>').addClass('fa fa-times').data('id', dog._id);
		const $img = $('<img>').attr('src',dog.photo);
		const $name = $('<h3>').text(dog.name);
		const $desc = $('<p>').text(dog.description);
		const $scoreContainer = $('<div>').addClass('score-container');
		const $score = $('<p>').text(dog.score).addClass('score');
		const $thumb = $('<p>').text('👍').addClass('updog').data('id',dog._id);
		$scoreContainer.append($score,$thumb);
		$container.append($closeBtn,$img,$name,$desc,$scoreContainer);
		$('#dogos').append($container);
	})
};

updog.events = () => {
	$('.add-dogo form').on('submit',(e) => {
		e.preventDefault();
		const dog = {
			name : $('#name').val(),
			description: $('#description').val(),
			photo: $('#photo').val()
		}
		
		updog.createDog(dog)
			.then(() => $('.add-dogo').toggleClass('show'))
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});

	$('.toggle-dogo').on('click',() => {
		$('.add-dogo').toggleClass('show');
	});

	$('#dogos').on('click', '.updog' , function() {
		const id = $(this).data('id');
		updog.upvote(id)
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});

	$('#dogos').on('click', '.fa-times', function() {
		const id = $(this).data('id');
		updog.delete(id)
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});
};

updog.init = () => {
	updog.getDogs()
		.then(updog.displayDogs);
	updog.events();
};

$(updog.init);