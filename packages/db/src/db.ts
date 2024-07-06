import pg from "pg";

class Pool {
  _pool: pg.Pool | null = null;

  connect(options: pg.PoolConfig) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1+1");
  }

  close() {
    this._pool?.end();
  }

  query(sql: string, params?: any[]) {
    return this._pool?.query(sql, params);
  }
}

export const pool = new Pool();
// export * from "@prisma/client";
