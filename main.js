
(function () {

	// initialize Firebase
	const config = {
		apiKey: "AIzaSyA3U0xtJ9lotXK4A0YSiWf7jodjslE7q70",
		authDomain: "diet-customizer.firebaseapp.com",
		databaseURL: "https://diet-customizer.firebaseio.com",
		projectId: "diet-customizer",
		storageBucket: "diet-customizer.appspot.com",
		messagingSenderId: "732439419915"
	};
	firebase.initializeApp(config);

	// reference names collection
	let usersRef = firebase.database().ref('users');
	//const usersRef = firebase.database().ref().child('users'); ????

	document.getElementById('newUser').addEventListener('submit', submitNew);
	document.getElementById('returningUser').addEventListener('submit', submitReturning);

	function submitNew(e) {
		e.preventDefault();

		let name = getInputVal('name');
		let username = getInputVal('username');
		let weight = getInputVal('weight');
		let restriction = document.querySelector('input[name = "restriction"]:checked').value;
		let goal = document.querySelector('input[name = "diet"]:checked').value;

		// save to database
		let date = new Date();
		let today = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

		saveNew(name, username, weight, restriction, goal, today);

		//show alert
		document.querySelector('.alert').style.visibility = 'visible';
		setTimeout(function () {
			document.querySelector('.alert').style.visibility = 'hidden';
		}, 8000);

		// clear form
		document.getElementById('newUser').reset();
	}

	// save form to firebase
	function saveNew(name, username, weight, restriction, goal, today) {

		let newUserRef = usersRef.push();
		newUserRef.set({
			name: name,
			username: username,
			weight: weight,
			restriction: restriction,
			goal: goal,
			date: today
		});
	}

	// get user's info from firebase
	function submitReturning(e) {
		e.preventDefault();

		let username = getInputVal('username1');
		let newWeight = getInputVal('weight1');

		/*
		console.log(newWeight);
		if(newWeight && username){
			// update user's weight & date in the database
			updateUser(username, newWeight);
		}
		*/

		// get user's info
		var info = {};
		let found = false;
		usersRef.on('value', function (snapshot) {
			snapshot.forEach(function (userSnapshot) {
				let user = userSnapshot.val();
				if (user.username == username) {
					found = true;
					display_info(user);
					return;
				};
			});
		});

		function display_info(info) {
			let weightChange = newWeight - info.weight;
			let weightStatus = "gained";
			if (weightChange <= 0) {
				weightStatus = "lost";
				weightChange = Math.abs(weightChange);
			}

			if (weightChange) {
				console.log(newWeight);
				updateUser(username, newWeight);
			}

			// display the user's info
			let display = document.getElementById('userInfo');
			display.children[0].innerHTML = "Hello, " + info.name + ". You " + weightStatus + " " + weightChange + " lbs since " + info.date + ".";
			display.children[1].innerHTML = "Dietary Restriction: " + info.restriction;
			display.children[2].innerHTML = "Fitness Goal: " + info.goal;
			display.style.visibility = 'visible';

			function updateUser(username, updateWeight) {
				usersRef.on('value', function (snapshot) {
					snapshot.forEach(function (userSnapshot) {
						let user = userSnapshot.val();
						if (user.username == username) {
							let date = new Date();
							let today = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

							let userKey = userSnapshot.key;
							usersRef.child(userKey).update({ weight: updateWeight, date: today });
							return;
						};
					});
				});
			}
		}
	}

	function getInputVal(id) {
		return document.getElementById(id).value;
	}

}());
