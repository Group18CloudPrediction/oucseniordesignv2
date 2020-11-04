const mongoose = require('mongoose');

const WeatherDataModel = mongoose.Schema(
    {
        author: { type: String, required: false },
        
        slrFD_W:    { type: Number, required: true },
        rain_mm:    { type: Number, required: true },
        strikes:    { type: Number, required: true },
        dist_km:    { type: Number, required: true },
        ws_ms:      { type: Number, required: true },
        windDir:    { type: Number, required: true },
        maxWS_ms:   { type: Number, required: true },
        airT_C:     { type: Number, required: true },
        vp_mmHg:    { type: Number, required: true },
        bp_mmHg:    { type: Number, required: true },
        rh:         { type: Number, required: true },
        rht_c:      { type: Number, required: true },
        tiltNS_deg: { type: Number, required: true },
        tiltWE_deg: { type: Number, required: true },
        
        tags: { type: [String], required: true },
        
        date:           { type: Date, required: true },
        date_mins_only: { type: Date, required: true },
        time_only:      { type: Date, required: true },
        
        system_num: { type: String, required: true }
    },
    { timestamps: true, collection: "WeatherData" },
);

module.exports = mongoose.model('weatherData', WeatherDataModel);
