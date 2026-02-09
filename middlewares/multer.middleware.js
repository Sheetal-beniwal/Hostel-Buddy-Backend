import multer from 'multer';

const storage = multer.diskStorage({   //Yahan aap define kar rahe ho:  file kahan save hogi, file ka naam kya hoga
    destination:function(req,file,cb){
        cb(null, "./public/temp")
    },
    filename:function(req,file,cb){
       cb(null, file.originalname)
    }
})

 export const upload = multer({ //Ye upload middleware ban gaya jo routes me use hoga.
    storage,
})