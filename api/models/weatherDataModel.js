const mongoose = require('mongoose');

// THIS IS THE DATALOGGER COLLECTION

// 
// Each entry in the weatherData table of our database will look like this below.
// Note: in MongoDB, tables are called "collections"
//
// these entries contain data pulled from the datalogger. Each entry contains
// all of the below data
//
const WeatherDataModel = mongoose.Schema(
    {
        author: { type: String, required: false },    // not used
        
        slrFD_W:    { type: Number, required: true }, // 
        rain_mm:    { type: Number, required: true }, // amount of rain
        strikes:    { type: Number, required: true }, // num lightning strikes
        dist_km:    { type: Number, required: true }, // distance to lightning strikes
        ws_ms:      { type: Number, required: true }, // wind speed in m/s
        windDir:    { type: Number, required: true }, // wind direction
        maxWS_ms:   { type: Number, required: true }, // 
        airT_C:     { type: Number, required: true }, // air temperature in degrees Celcius
        vp_mmHg:    { type: Number, required: true }, // volumetric pressure in milimeters mercury
        bp_mmHg:    { type: Number, required: true }, // barometric pressure in milimeters mercury
        rh:         { type: Number, required: true }, // relative humidity
        rht_c:      { type: Number, required: true }, //
        tiltNS_deg: { type: Number, required: true }, //
        tiltWE_deg: { type: Number, required: true }, //
        
        tags: { type: [String], required: true }, // not totally sure what this is, but it's always there
        
        date:           { type: Date, required: true }, // the date and time (with seconds) that this measurement was recorded
        date_mins_only: { type: Date, required: true }, // the date and time (without seconds) that this measurement was recorded
        time_only:      { type: Date, required: true }, // the time that this measurement was recorded (in hours, minutes, seconds since the epoch (1/1/1970)
        
        system_num: { type: String, required: true } // the id of the jetson / substation that this information was recorded at
    },
    { timestamps: true, collection: "WeatherData" }, 
);

module.exports = mongoose.model('weatherData', WeatherDataModel);
