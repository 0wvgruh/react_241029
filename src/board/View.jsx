import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function View() {
  const { bid } = useParams(); // URL에서 가져온 bid
  const [boardData, setBoardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`/data/popular.json`);
        
        // 응답 데이터에서 bid와 일치하는 id를 가진 항목을 찾음
        const matchingData = response.data.items.find(item => item.id === bid);

        if (matchingData) {
          setBoardData(matchingData); // 일치하는 데이터 설정
        } else {
          console.log('해당 ID에 맞는 데이터를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.log('데이터 가져오기 오류:', error);
      }
    };

    fetchBoardData();
  }, [bid]);

  const handleBoardUpdate = async () => {
    try {
      navigate(`/update/${bid}`);
    } catch (error) {
      console.log('업데이트 페이지로 이동 오류:', error);
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  if (!boardData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div id="wrap">
      <section id="container" className="sub">
        <div id="contents">
          <div className="sub-title-area">
            <h2 className="tit">뉴스 및 정보</h2>
          </div>
          <div className="write_title">
            {boardData.snippet.title}
          </div>
          <div className="write_date">
            <span className="write_line"><strong>작성자 :</strong> {boardData.snippet.channelTitle} </span>
            <span className="write_line">{formatDate(boardData.snippet.publishedAt)}</span>
          </div>
          <div className="con_box">
            <h3>내용</h3>
            <p>{boardData.snippet.description}</p>
          </div>
          <div className="btn_area">
            <button className="btn_blue" onClick={() => { navigate('/list'); }}>목록</button>
            <button type="button" className="btn_blue" onClick={handleBoardUpdate}>수정</button>
            <button type="button" className="btn_blue">삭제</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default View;
