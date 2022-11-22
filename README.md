# PUBLIC ENDPOINTS

[POST] /user/register -> Allows to create a new user in the database

[POST] /user/login -> Responds with a token when the user is in the database

# ENDPOINTS WITH TOKEN

[GET] /predictions -> Responds with a list of predictions of the logged user.

[GET] /predictions/:id -> Responds with the prediction that corresponds with the received id.

[GET] /predictions/filter/:filterprediction -> Responds with a list of predictions that correspond with the filter recieved.

[POST] /predictions/create -> Allows to create a new prediction in the database.

[DELETE] /predictions/delete/:id -> Deletes the prediction with the received id.

[PATCH] /predictions/update/:id -> Updates the data of the prediction with the received id.
