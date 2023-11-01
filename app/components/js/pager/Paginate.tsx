"use client";
import { useEffect, useState } from "react";
import styles from "./Pager.module.scss";

const Paginate: React.FC<{ data: any[]; setData: (data: any[]) => void }> = ({
  data,
  setData,
}) => {
  const [page, setPage] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [pageGroups, setPageGroups] = useState<number[][]>([]);
  useEffect(() => {
    let vis: any[] = [];
    for (let i = page * 10; i < page * 10 + 10 && i + 1 <= data.length; i++)
      vis.push(data[i]);

    setData(vis);
  }, [data, page]);
  useEffect(() => {
    setPageGroups(() => []);
    const pgs: number[] = [];
    let allPages =
      data.length % 10 == 0
        ? data.length / 10
        : Math.floor(data.length / 10) + 1;
    for (let i = 0; i < allPages; i++) pgs.push(i);
    for (let i = 0; i < pgs.length; i += 10) {
      const nos: number[] = [];

      for (let k = i; k < pgs.length && k < i + 10; k++) nos.push(k);
      setPageGroups((e) => [...e, nos]);
    }
  }, [data]);
  const slider = (add: boolean) => {
    if (add) {
      setLeft((e) => (e + 1 < pageGroups.length ? e + 1 : e));
    } else {
      setLeft((e) => (e - 1 < 0 ? e : e - 1));
    }
  };
  return (
    <div className={styles.controllers}>
      {pageGroups.map((pageGroup, i) => {
        return (
          <div key={i} className={left === i ? styles.pages : styles.hide}>
            {pageGroup.map((page) => (
              <span
                key={page}
                onClick={() => {
                  setPage(page);
                }}
              >
                {page + 1}
              </span>
            ))}
          </div>
        );
      })}
      {data.length > 100 && (
        <div className={styles.movers}>
          <span onClick={() => slider(false)}> &lt;</span>
          <span onClick={() => slider(true)}> &gt;</span>
        </div>
      )}
    </div>
  );
};

export default Paginate;
