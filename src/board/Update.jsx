import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

async function fetchBoard(bid) {
  try {
    const response = await axios.get(`/bizz/board/getUpdate/${bid}`);
    console.log('Board fetched:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error fetching board data:', error.message);
    throw error; // Rethrow the error so it can be caught by the caller
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  if (!file){

    formData.append('file', []);
  } else{
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  }

  console.log("file" + formData);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file', error);
    throw error;
  }
}

async function BoardUpdate(boardData, file) {
  const formData = new FormData();
  formData.append('board', new Blob([JSON.stringify(boardData)], { type: "application/json" }));

  if (file) {
    formData.append('file', file);
  }
  else{
    formData.append('file', []);
  }

  try {
    const response = await axios.post('/bizz/board/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Board updated:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error updating board data:', error.message);
    throw error;
  }
}

const Update = () => {
  const { bid } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]); // State to hold files associated with the board
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    if (bid) {
      fetchBoard(bid).then((board) => {
        setTitle(board.title);
        setWriter(board.writer);
        setContent(board.content);
        setFiles(board.files); // Update state with board files
      }).catch((error) => {
        console.log('Error fetching board data:', error.message);
        // Handle error if necessary
      });
    }
  }, [bid]);

  const move = () => {
    navigate('/list');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let uploadedFile = file;
      
      if(!uploadedFile){
        uploadedFile = '';
      } 

      console.log('uploadedFile'+ uploadedFile);

      const boardData = {
        bid: bid,
        title: title,
        writer: writer,
        content: content,
        regTime: new Date().toISOString(), // Assuming regTime is a new Date
        viewCount: 0, // Set the viewCount to 0 or as required
      };
      
      console.log(uploadedFile);
      await BoardUpdate(boardData, uploadedFile);
  
      console.log('Board updated');
      alert('글 수정 완료');
      move();
    } catch (error) {
      console.log('Error handling submit:', error.message);
      alert('Error handling submit');
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div id="wrap">
      <section id="container" className="sub">
        <div id="contents">
          <div className="sub-title-area">
            <h2 className="tit">News & Info</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <table className="basic_write">
              <caption>News 수정</caption>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: '*' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>제목<span className="star">*</span></th>
                  <td>
                    <input
                      type="text"
                      title="제목"
                      className="add_txt"
                      placeholder="제목 *"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>작성자<span className="star">*</span></th>
                  <td>
                    <input
                      type="text"
                      title="성명"
                      className="name_txt"
                      placeholder="성명 *"
                      value={writer}
                      onChange={(e) => setWriter(e.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>첨부파일</th>
                  <td>
                    <input
                      type="file"
                      title="첨부파일"
                      className="name_txt"
                      ref={fileInput}
                      onChange={handleFileChange}
                    />
                  </td>
                  <h3>불러온 첨부파일:</h3>
                  <td>
                    <textarea
                      type="file"
                      title="불러온 첨부파일"
                      className="name_txt"
                      value={files}
                    />
                  </td>
                </tr>
                <tr>
                  <th>내용 <span className="star">*</span></th>
                  <td>
                    <textarea
                      cols="30"
                      rows="10"
                      style={{ width: '100%' }}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="btn_area">
              <button type="submit" className="btn_blue">확인</button>
              <a href="#" className="btn_blue_line" onClick={move}>취소</a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Update;
