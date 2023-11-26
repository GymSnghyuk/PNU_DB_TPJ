const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);

//검색단어 입력 후 검색버튼 누르면
router.post(`/:find`, (req,res,next)=>[
    
])

module.exports = router;