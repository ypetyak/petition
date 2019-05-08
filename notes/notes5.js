NAMING THINGS!!!!

// a function that gets user data

function getUserData() {

}

// a variable that contains signature info

var signatureInfo = {
    id, sig
}


// a function that creates a new user in the DB

function createNewUser() {}

// editing a users

editUser

//URL - displaying a specific user based on their id

/user/:id



////

// to use req.body we will need a body parcer

app.use(bodyParser.urlencoded({ extended: false }))

req.body = {
    age: 7000,
    city: 'Atlantis',
    url: 'atlantis.secret'
}

//// to destruct a variable

const { age, city, url } = req.body

///

const {street} = this.state.user.address.street

/// now we can use it like ->

street



///

SELECT users.first, users.last, users.email, users.password, user_profiles.age, user_profiles.city, user_profiles.url, user_profiles.user_id 
FROM users
JOIN user_profiles
ON users.id = user_profiles.user_id
