export const isAdmin = (req,res,next)=>{
    try {

        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"User not authenticated"
            })
        }

        if(req.user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Admin access required"
            })
        }

        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error in admin middleware"
        })
    }
}
