const cleanOfferingData = (data) => {
    // The data coming in is messy. Time to clean it up so it's useable.
    // First get the data in its raw form
    let rawOfferings = data.offerings.data;
    // Then create a clean array to push it into
    const offerings = [];
    // Isolate one of the dirty offerings at a time
    for (let i=0; i<rawOfferings.length; i++) {
        let current = rawOfferings[i].attributes.shifts.data;
        // Clean it up further -- Get down past the attributes to the meat
        // of the shift
        // Begin with a place to hold the super-clean version
        const cleanOffering = [];
        for (let j=0; j<current.length; j++) {
            cleanOffering.push(current[j].attributes);
        };
        // Now push the clean offering into offerings
        offerings.push(cleanOffering);
    };
    // Reverse the array so offerings appear with most recent first
    offerings.reverse();
    return offerings;
};

export { cleanOfferingData };