import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();



app.use(cors(
    {
        origin: '*',
        methods: ['GET','POST','PUT','DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type','Authorization'], 
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(cookieParser());

//routes
import router from './routes/user.routes.js';
import { userProfileRouter } from './routes/userProfile.routes.js';
import { communityRouter } from './routes/community.routes.js';
app.use('/api/users',router);
app.use('/api/profile',userProfileRouter);
app.use('/api/community', communityRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
