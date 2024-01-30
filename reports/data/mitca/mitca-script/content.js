const axios = require('axios');

async function beforeRender(req, res) {
    req.data.courses = await fetchCourses();
}


