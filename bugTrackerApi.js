import {app,router} from "./init/serverInit.js"
import seq from "sequelize"
import {Projects,ProjectsxMembers,Members, Bugs} from "./bugTracker.js"
import { response } from "express"


router.route("/addProject").post((req,res)=>{
    Projects.create({   
        ProjectName: req.body.ProjectName,
        RepositoryLink: req.body.RepositoryLink
    }).then(response=> res.json("done!"));
})



router.route("/getProjects").get((req,res)=>{
    Projects.findAll().then(result=>res.json(result)).catch(err=>error.log(err));
})

var port = 8000;





//BugName:
//BugSeverity:

router.route("/addBug").post((req,res)=>{
    Bugs.create({
        BugName: req.body.BugName,
        RepositoryLink: req.body.RepositoryLink,
        BugSeverity: req.body.BugSeverity,
        ProjectId: req.body.ProjectId
    }).then(response=> res.json("done!"));
})




router.route("/getBugs").get((req,res)=>{
    Bugs.findAll().then(result=>res.json(result)).catch(err=>error.log(err));
})


app.listen(port,()=>{
    console.log("Listening on port: "+ port);
})