const spanDate = document.getElementById('dateHere');
const data = document.getElementById('data');
const textarea = document.getElementById('logtext');
const logsubmitBtn = document.getElementById('logsubmit');
const textareaLabel = document.getElementById('logtextlabel');
const tableDate = document.getElementById('alllogDate');

/----USERS DURATION DATES----/;
const startDate = data.dataset.startdate;
const endDate = data.dataset.enddate;

const student_logs = data.dataset.studentlogs;
const logdate = data.dataset.logdate;

// console.log('the users start date is ' + startDate + ' and the end date is ' + endDate);

/----TODAYS DATE----/;
const today = new Date();
spanDate.innerHTML = format(today);

/----TO HUMAN READABLE DATE----/;
function format (date) {
  const d = new Date(date);
  const month = (d.getMonth() + 1);
  const day = d.getDate();
  const year = d.getFullYear();
  let temp = '' + ((day < 10) ? '0' : '') + day;
  temp += ((month < 10) ? '/0' : '/') + month;
  temp += '/' + year;

  return temp;
}

/----TO EPOCH TIMESTAMP----/;
function toEpoch (date) {
  const d = new Date(date);
  const fullms = d.getTime();

  return fullms;
}
// epoch start time: 1584651600000  epoch end time: 1587330000000now epoch: 1614339653626

const start = toEpoch(startDate);
const end = toEpoch(endDate);
const now = toEpoch(today);
console.log('epoch start time: ' + start + '  epoch end time: ' + end + 'now epoch: ' + now);

if (now < start || now > end) {
  // console.log("not within time frame")
  textarea.disabled = true;
  logsubmitBtn.disabled = true;

  textarea.placeholder = `YOU WILL START FILLING YOUR LOGBOOK ON ${format(startDate)}`;
  logsubmitBtn.value = 'Wait';
}
if (now > end) {
  textarea.placeholder = 'YOU ATTACHMENT PROGRAMME IS OVER; PROCEDE TO CLEARANCE WITH YOUR SUPERVISOR';
}

/----SUBMIT----/;
console.log(`todays date:  ${format(today)},  logdate:${format(logdate)}`);

if (format(logdate) == format(today)) {
  logsubmitBtn.disabled = true;
  logsubmitBtn.value = 'Submitted';
  textarea.disabled = true;
  textarea.innerHTML = `${student_logs}`;
  textareaLabel.innerHTML = "Todays' Log(s) are Successfully Submitted";
}
