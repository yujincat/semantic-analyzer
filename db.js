import sqlit3 from 'sqlite3'
import e from 'express'
sqlit3.verbose()
var db = new sqlit3.Database('reports.db')
const TABLENAME = 'reports'

export default class DBHelper {
  constructor() {
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS ${TABLENAME} (
          report TEXT,
          url TEXT,
          created TEXT,
          updated TEXT
        );
      `

    db.serialize(function () {
      const stmt = db.prepare(sql)
      stmt.run();
      stmt.finalize();
    })
  }

  insertReport(url, comment) {
    const nowDate = new Date()
    const now = nowDate.toString()

    db.serialize(function () {
      const stmt = db.prepare(`INSERT INTO ${TABLENAME} VALUES (?, ?, ?, ?)`)
      stmt.run(comment, url, now.toString(), now.toString());
      stmt.finalize();
    })
  }

  updateReport(url, comment) {
    db.serialize(function () {
      const stmt = db.prepare(`UPDATE ${TABLENAME} SET report=(?) WHERE url = (?)`)
      stmt.run(comment, url);
      stmt.finalize();
    })
  }

  deleteReport(url) {
    db.serialize(function () {
      const stmt = db.prepare(`DELETE from ${TABLENAME} where url = (?)`)
      stmt.run(url);
      stmt.finalize();
    })
  }

  print(count) {
    // const sql = `SELECT * FROM ${TABLENAME} LIMIT ${count}`
    db.serialize(function () {
      db.each(`SELECT rowid AS id, report, url, created, updated FROM ${TABLENAME} LIMIT ${count}`, function (err, row) {
        console.log(row.id + ": " + row.url + ", " + row.report);
      });
    })
  }

  close() {
    db.close(function (err) {
      if (err) {
        console.error(e)
      }
    })
  }
}

