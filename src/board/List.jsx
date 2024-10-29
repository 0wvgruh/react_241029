import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/general.css';
import { useNavigate } from 'react-router-dom';
import { getFakemostPopular } from '../api/youtube02';

function List() {
  const [boardList, setBoardList] = useState([]);
  const [filteredBoardList, setFilteredBoardList] = useState([]); // 검색된 결과 상태
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [pageSize, setPageSize] = useState(5); // 한 페이지에 보여질 항목 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFakemostPopular();
        setBoardList(data);
        setFilteredBoardList(data); // 기본적으로 전체 데이터를 필터링된 목록으로 설정
      } catch (error) {
        console.log('데이터를 불러오는 중 에러:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // 제목 또는 설명에 검색어가 포함된 항목만 필터링
    const filteredData = boardList.filter((item) =>
      item.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
      item.snippet.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredBoardList(filteredData); // 필터링된 결과 업데이트
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const moveView = (bid) => {
    navigate(`/view/${bid}`);
  };

  const moveWrite = () => {
    navigate('/write');
  };

  // 페이지 변경 시 호출될 함수
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // 현재 페이지에 해당하는 데이터 가져오기
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBoardList.slice(startIndex, endIndex);
  };

  // 전체 페이지 수 계산
  useEffect(() => {
    if (filteredBoardList.length > 0) {
      const totalPages = Math.ceil(filteredBoardList.length / pageSize);
      setTotalPages(totalPages);
    }
  }, [filteredBoardList, pageSize]);

  return (
    <div id="wrap">
      <section id="container" className="sub new">
        <div id="contents">
          <div className="sub-title-area">
            <h2 className="tit">News & Info</h2>
          </div>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="검색어를 입력하세요"
              className="search-input"
            />
          </div>
          <div className="btn_area">
            <p className="btn_blue_line" onClick={moveWrite} style={{ cursor: 'pointer' }}>글쓰기</p>
          </div>
          <table className="news_list">
            <caption>News 리스트</caption>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '*' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">등록일</th>
                <th scope="col">조회</th>
                <th scope="col">첨부</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((board, index) => (
                <tr key={board.id}>
                  <td>{board.id}</td>
                  <td className="board_txt">
                    <p onClick={() => moveView(board.id)} style={{ cursor: 'pointer' }}>
                      {board.snippet.title}
                    </p>
                  </td>
                  <td className="board_man">{board.snippet.channelTitle}</td>
                  <td className="board_date">{board.snippet.publishedAt}</td>
                  <td className="board_read">{board.snippet.description}</td>
                  <td className="board_file">
                    {board.files && <span className="file_icon">파일다운로드</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <a className={`prev end ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => changePage(1)} href="#">첫 페이지</a>
            <a className={`prev ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => changePage(currentPage - 1)} href="#">이전 페이지</a>
            {[...Array(totalPages).keys()].map((page) => (
              <a key={page} className={page + 1 === currentPage ? 'on' : ''} onClick={() => changePage(page + 1)} href="#">
                {page + 1}
              </a>
            ))}
            <a className={`next ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => changePage(currentPage + 1)} href="#">다음 페이지</a>
            <a className={`next end ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => changePage(totalPages)} href="#">마지막 페이지</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default List;
