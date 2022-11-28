//변경 코드
import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Link } from "@chakra-ui/react";

// pagination template 및 css
import Pagination from "react-js-pagination";
import "../../../../public/css/pagination.css";

const axios = require("axios").default;

export default function EstimateList() {
  const [data, setData] = useState("");
  // totalItemsCount data 총 개수
  const [totalEstimate, setTotalEstimate] = useState(0);

  // activePage 현재 페이지
  const [page, setPage] = useState(1);

  // itemsCountPerPage 한 페이지 당 보여지는 데이터 개수
  const [perPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getData();
  }, [page]);

  // 견적 목록 첫 화면
  const getData = async () => {
    const URL = `/api/estimate?keyword=${keyword}&offset=${perPage}&page=${page}`;

    const res = await axios.get(URL, {
      headers: {
        "content-type": "application/json",
      },
    });
    setData(res.data.data.estimates);
    setTotalEstimate(res.data.data.total_count);
  };

  // input 키워드 입력
  const searchKeyword = useCallback((e) => {
    setKeyword(e.target.value);
  });

  // input button(검색 버튼) 누를 때
  const handleSearch = async () => {
    let page = 1;

    // 검색 후, 재검색할 때 첫번째 페이지로 이동
    if (keyword && page) {
      inputSearchKeyword(keyword);
    } else {
      getData(keyword);
    }
  };

  // 엔터(enter) 키 이벤트
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 현재 페이지 설정 pagination onChange
  const handleSetPage = (page) => {
    setPage(page);
  };

  // 재검색할 때 첫 페이지로 이동
  const inputSearchKeyword = async () => {
    const URL = `api/estimate?keyword=${keyword}&offset=${perPage}&page=1`;

    const res = await axios.get(URL, {
      headers: {
        "content-type": "application/json",
      },
    });
    setData(res.data.data.estimates);
    setTotalEstimate(res.data.data.total_count);
  };

  return (
    <>
      <div className="col-sm-12 table-responsive">
        <div className="card-shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">견적목록</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12">
                    <div id="search_form" className="mb-2">
                      <div className="row search_area">
                        <div className="col-sm-5">
                          <div className="input-group input-group-sm">
                            <a type="buttonName" className="btn btn-sm btn-outline-primary mr-2" href="/estimate/list2">
                              전체목록
                            </a>
                            <input
                              type="text"
                              className="form-control form-control-sm bg-light border-primary small"
                              placeholder='PN, 회원명, 회원ID, 견적명'
                              value={keyword}
                              onChange={searchKeyword}
                              onKeyPress={handleKeyPress}
                            />
                            <div className="input-group-append">
                              <button className="btn btn-primary" type="button" onClick={() => handleSearch()}>
                                <i className="fas fa-search fa-sm"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table small table-striped table-hover table_vertical_middle">
                    <thead className="thead-dark">
                      <tr>
                        <th colSpan={2} style={{ textAlign: "center" }}>
                          견적정보
                        </th>
                        <th style={{ textAlign: "center" }}>회원정보</th>
                        <th style={{ textAlign: "center" }}>상품수</th>
                        <th style={{ textAlign: "center" }}>견적수집</th>
                        <th style={{ textAlign: "center" }}>메일발송</th>
                        <th colSpan={2} style={{ textAlign: "center" }}>
                          요청일
                        </th>
                      </tr>
                    </thead>
                    <tbody className="tbody-dark">
                      {data.length > 0 ? (
                        data.map((e) => (
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <input type="checkbox" className="form-check es_check"></input>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div>
                                <Link href={`http://127.0.0.1:8000/estimate/detail/${e.es_id}`}>{e.es_id}</Link>
                              </div>
                              <div className="pl-1 font-weight-bold font-12">{e.es_name}</div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div>
                                {e.user ? (
                                  <>
                                    <Link href={`http://127.0.0.1:8000/member/detail/${e.user.mb_no}`}>
                                      {e.user.mb_name}({e.user.mb_no})
                                    </Link>
                                    <div>{e.user.mb_id}</div>
                                  </>
                                ) : (
                                  <>
                                    비회원
                                    <div className="small">
                                      {e.user_name}-{e.writer_email}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>{e.es_cnt}</td>
                            <td style={{ textAlign: "center" }}>
                              {e.alarm_flag === "Y" ? (
                                <span className="badge badge-primary p-2">완료</span>
                              ) : (
                                <span className="badge badge-danger p-2">대기중</span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {e.mail_flag === "Y" ? (
                                <span className="badge badge-primary p-2">완료</span>
                              ) : (
                                <span className="badge badge-danger p-2">미발송</span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>{e.reg_date.substr(0, 10)}</td>
                            <td style={{ textAlign: "center" }}>
                              <Link
                                href={`http://127.0.0.1:8000/estimate/detail/${e.es_id}`}
                                className={"btn btn-sm btn-outline-primary font-12"}
                              >
                                상세
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center" }}>
                            데이터가 없습니다.
                          </td>{" "}
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div>
                    <Pagination
                      // 현재 활성화 되는 페이지
                      activePage={page}
                      // 한 페이지당 보여지는 데이터의 개수
                      itemsCountPerPage={perPage}
                      // 데이터의 총 개수
                      totalItemsCount={totalEstimate}
                      // 한 화면에 보여지는 페이지 개수
                      pageRangeDisplayed={5}
                      // 이전 버튼 모양
                      prevPageText={"‹"}
                      // 다음 버튼 모양
                      nextPageText={"›"}
                      // 클릭 시 페이지 효과
                      onChange={handleSetPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// react 해당 blade 연결
if (document.getElementById("react-estimate-list")) {
  const el = document.getElementById("react-estimate-list");
  ReactDOM.render(<EstimateList {...el.dataset} />, el);
}

