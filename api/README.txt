This is where the backend api is set up.

- Models defines the different data our database stores, and the format of that data.

- Controllers defines functions that access that data to pull, push, edit, or delete. In our project, there are only pull operations for efficiency purposes. (The only data source, the Jetson, should never need to push and then pull data. The website will never push data.)

- Routes defines the URLs that call the functions in controllers (and send the results via https)

Typically, each form of data (predictions, verifications, weather data, etc) will have one model, one controller, and one router. There are some exceptions, such as verifications and predictions being bundled together.
