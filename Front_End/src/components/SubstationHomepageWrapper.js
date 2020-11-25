//
// This file looks a little stubby, doesn't it?
// well, as it turns out, useParams() is a function
// only available to function-defined components.
// However, our substation homepage component needed
// to be a class-defined component. Yet we still needed
// to pull the :stationID parameter from the url.
// Our solution was to make this component to pull the
// url parameter, and then have it pass that to 
// our real SubstationHomepage as a prop.
//

import React from "react";
import { useParams } from "react-router-dom";

import SubstationHomepage from "./SubstationHomepage";

function SubstationHomepageWrapper() {
    let { stationID } = useParams();

    return (
        <SubstationHomepage stationID={stationID} />
    );
}

export default SubstationHomepageWrapper;
