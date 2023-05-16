import React from "react";
// import axios from "axios";
import { useEffect, useState } from "react";
import TopNav from "../../components/Nav/TopNav";
import styles from "./EnrollmentCar.module.css";
// import car from "../../assets/car3.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function EnrollmentCar() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const { data1 } = location.state ?? { data1: "" }; // feeletter에서 차 넘버로 받아옴 이거는 feeletter 고지서미리보기 버튼을 누르지 않으면 실행 nono
  const { data2 } = location.state ?? { data2: "" }; /// feeletter에서 받아온 id임 이걸로 axios에서 받아오면돼 다시
  const [InputText, setInputText] = useState(data1); //고지서미리보기 버튼을 누르지 않았으면 data가 null값 이니깐 작동 가능
  // const [nail, setsumnail] = useState(null);
  const [id, setid] = useState(data2 || "");
  let [carImageUrl, setCarImageUrl] = useState("");
  let [date, setdate] = useState("")
  let [locations, setlocation] = useState("")
  let [fine, setfine] = useState("")

  let navigate = useNavigate();
  const sessionStorage = window.sessionStorage;
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    console.log(token);
    axios
      .get("http://localhost:8081/api/record/live-report-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.responseData);
        setPosts(res.data.responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [InputText]);

  const clickitem = (title, id) => {
    setInputText(title);

    // 이부분 axios로 받아와야함
    setid(id);
    // postsss(id)
    const post = posts.find((post) => post.id === id); //id가 같으면 그 객체가 가지고 있는 사진
    setCarImageUrl(post.carImageUrl);
    setdate(post.date)
    ///사진을 받아온거임
    setlocation(post.location)
    setfine(post.fine)
  };

  const onChange = (e) => {
    setInputText(e.target.value);
  };


  const deleteButton = (e) => {
    e.preventDefault();

    axios.delete("http://localhost:8081/api/record/delete-by-id"
      , {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          id: id
        }
      })
      .then(data => {
        if (!data.data.success) {
          alert("삭제 실패.")
        } else {
          alert("삭제 완료!")
        }
      })
      .catch(err => console.log(err));
  }

  const button = (e) => {
    e.preventDefault();
    // setInputText(InputText);
    const data = {
      id: id,
      carNum: InputText,
    }
    console.log(data);
    axios.put("http://localhost:8081/api/record/fine"
      , data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(data => {
        if (!data.data.success) {
          alert("등록된 차량이 없습니다.")
        } else {
          alert("수정 완료!")
        }
      })
      .catch(err => console.log(err));
  };



  let fordate = date.replace("T", " ");

  return (
    <div className={styles.background}>
      <TopNav />
      <div className={styles.body}>
        <div className={styles.now}>
          <div className={styles.now1}>
            {posts.map((post, index) => (
              <div
                className={styles.nums}
                key={index}
                onClick={() => clickitem(post.carNum, post.id)}
              >
                <div className={styles.num}>{post.carNum}</div>
                <hr></hr>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.imgcon}>
          {!carImageUrl && <div>리스트에서 차량 번호를 선택해주세요</div>}
          {carImageUrl && <img src={carImageUrl} alt="logo" className={styles.img} />}
        </div>

        <div className={styles.detailscon}>
          <div className={styles.details}>
            <div className={styles.detail}>
              <div className={styles.title}>차량번호</div>
              <div className={styles.data1}>
                <form onSubmit={button} style={{ width: "60%" }}>
                  <input
                    type="text"
                    value={InputText}
                    onChange={onChange}
                    className={styles.input}
                  />
                </form>
                <div onClick={button} className={styles.button}>
                  <div>수정</div>
                </div>
              </div>
            </div>

            <div className={styles.detail}>
              <div className={styles.title}>적발일시</div>
              <div className={styles.data}>{fordate}</div>
            </div>
            <div className={styles.detail}>
              <div className={styles.title}>적발장소</div>
              <div className={styles.data}>{locations}</div>
            </div>
            <div className={styles.detail}>
              <div className={styles.title}>납부금액</div>
              <div className={styles.data}>{fine}</div>
            </div>
            <div className={styles.bill}>
              <div
                className={styles.button1}
                onClick={() => {
                  navigate("/feeletter", {
                    state: { data1: InputText, data2: id },
                  });
                }}
              // "inputtext"(=즉 carnum) 이부분에 들어간 걸 feeletter로 보내는 거임 id는 id
              >
                고지서 미리보기
              </div>
            </div>
          </div>
          <div className={styles.button2} style={{ marginBottom: "3%" }}>
            납부 알림 메시지 전송
          </div>
          <div onClick={deleteButton} className={styles.button2}>삭제</div>
        </div>
      </div>
    </div>
  );
}