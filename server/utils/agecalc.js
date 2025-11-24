function getAge(dob) {
  const today = new Date();
  dob = new Date(dob);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

module.exports = {
    getAge
}