const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("./helpers/options");


const dView = async (req, res, next) => {
    if(req.user == "undefined" || req.user == undefined){
      res.redirect('/');
    } else{
        if (req.user.is_admin) {
            res.redirect('/d/admin');
        } else {
            console.log("rendering std dashboard...");
            let link = await genPDF(req,res,next);
            res.render("d", {
            NAME: req.user.f_name,
            link:link
            });
        };
    };
}

//=========================================================GENERATING PDF()===========================

const genPDF = async (req, res, next) =>{
    const html = fs.readFileSync(path.join(__dirname, '../views/Templates/pdf.html'), 'utf-8');
    const fileName = req.user.name + 'attach_letter' + Math.random() + '.pdf';
    
    const document = {
        html: html,
        data:{
            FIRSTNAME: req.user.f_name,
            LASTNAME: req.user.l_name,
            PROGRAMME: req.user.programme,
            EMAIL: req.user.email
        },
        path:'./public/docs/' + fileName
    }
    pdf.create(document,options)
    .then(console.log('success'))
    .catch( e => console.log(e) );

    let filePath = fileName;
    console.log(filePath);
    return filePath;
}
//=============================================================================================================

module.exports = {
    dView,
    genPDF
};