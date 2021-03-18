// module.exports = {
//     format: "A4",
//     orientation: "portrait",
//     border: "5mm",
//     header: {
//         height: "10mm",
//         contents: '<div style="text-align: center;"><hr></div>'
//     },
//     footer: {
//         height: "20mm",
//         contents: {
//             default: '<footer class="center"><small>JKUAT is ISO 9001:2015 and ISO 14001:2025 Certified &#169; <br>Setting Trends is Higher Education, Research, Innovations and Enterprenureship</small></footer>', // fallback value
//         },
//         type: "pdf",
//         timeout: 60000
//     }
// }

//=========================================================GENERATING PDF()===========================

const PDFDocument = require('pdfkit')
  , fs = require("fs");

exports.genPDF = async (req, res, next) => {

  const doc = new PDFDocument;

  const fileName = await req.user.first_name + '_' + req.user.registration_number + '.pdf';

  //check if directory exists
  let dir = 'public/docs/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  doc.pipe(fs.createWriteStream(dir + fileName));

  let filepath = '\\docs\\' + fileName;
  console.log(filepath);


  doc
    .fontSize(16)
    .text("JOMO KENYATTA UNIVERSITY OF AGRICULTURE AND TECHNOLOGY", {
      width: 470,
      align: 'center'
    }
    );

  doc
    .moveDown(0.5).fontSize(12)
    .text("P.O BOX 62000,00200, Nairobi, Tel: +254-020-892223/4, 891198,891566", {
      align: 'center'
    }
    );
  doc
    .moveDown(0.5)
    .text("Fax:8907997, Email:itdeptkarencampus@jkuat.ac.ke", {
      align: 'center'
    }
    );
  doc
    .moveDown(0.5).fontSize(14)
    .text("KAREN CAMPUS", {
      align: 'center'
    }
    );
  doc
    .moveDown(0.5)
    .text("DEPARTMET OF " + req.user.department_name, {
      align: 'center'
    }
    );
  doc.moveDown().moveTo(0, 90)
    .lineTo(0, 200)
    .lineTo(700, 200)
    .stroke();

  doc
    .moveDown().fontSize(12)
    .text("JKU/O3/APS&IT/STU/9K", {
      align: 'left'
    }
    );
  doc
    .moveDown(0.5).fontSize(14)
    .text("TO WHOM IT MAY CONCERN", {
      align: 'center'
    }
    );

  doc
    .moveDown(0.5)
    .text("SUB: INDUSTRIAL ATTACHMENT FOR " + req.user.first_name + " " + req.user.last_name + " " + req.user.other_name, {
      align: 'left',
      underline: 'true'
    }
    );
  doc
    .moveDown(0.3)
    .text("REG.NO: " + req.user.registration_number, {
      align: 'left',
      underline: 'true'
    }
    );

  doc
    .font('Times-Roman', 13)
    .moveDown()
    .text("This is to certify that the above named is a student at the Jomo Kenyatta university of agriculture and Technology, Karen Campus pursuing " + req.user.programme_name + ". A programme in the Department of " + req.user.department_name + "; school of" + req.user.school_name + ".", {
      align: 'justify',
      height: 300,
      ellipsis: true
    });

  doc
    .moveDown()
    .text("One of the requrements of the programme is a three month Industial Attachment for every student. The attachment is ment to expose the students to real work environments and enable them to apply concepts, issues and skills learnt in class.", {
      align: 'justify',
      height: 300,
      ellipsis: true
    });

  doc
    .moveDown()
    .text("The department will be gratefull if you offer an attachment opportunity to " + req.user.first_name + " " + req.user.last_name + " in your organisation for three months.", {
      align: 'justify',
      height: 300,
      ellipsis: true
    });

  doc
    .moveDown()
    .text("Any neccesarry assistance accorded to the student will be highly appreciated", {
      align: 'left',
      height: 300,
      ellipsis: true
    });

  doc
    .moveDown()
    .font('Times-Bold', 14)
    .text("MR.MORRICE MBAO");

  doc
    .moveDown(0.3)
    .text("ASSOCIATE CHAIR PERSON", {
      bold: "bold"
    });

  doc
    .moveDown(0.3)
    .text("APS & " + req.user.department_name);

  doc.end();
  return filepath;
}