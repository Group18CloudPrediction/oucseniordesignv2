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
