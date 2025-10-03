import alasql from 'alasql'

export default function () {
  function exportCSV(fields, data) {
    alasql.promise(
      `SELECT ${fields}
      INTO CSV("admred.csv", {separator: ",",headers:true})
      FROM ?`, [data])
  }
  return {
    exportCSV
  }
}