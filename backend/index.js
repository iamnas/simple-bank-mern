const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const rootRouter = require('./routes/index');

app.use(cors());
app.use(express.json());

app.get('/',(req, res) => {
    res.status(200).json({
        status: 200,
        message:"Welcome"
    })
})

app.use('/api/v1',rootRouter);

app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
    
})