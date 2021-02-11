module.exports = {
    format: "A4",
    orientation: "portrait",
    border: "5mm",
    header: {
        height: "10mm",
        contents: '<div style="text-align: center;">ATTACHMENT LETTER</div>'
    },
    footer: {
        height: "20mm",
        contents: {
        default: '<footer class="center"><small>JKUAT is ISO 9001:2015 and ISO 14001:2025 Certified &#169; <br>Setting Trends is Higher Education, Research, Innovations and Enterprenureship</small></footer>', // fallback value
    },
    type: "pdf",
    timeout: 60000
}}