import http from 'http';
import crypto from 'crypto';


const loginOpark = (username, password) => {
  return new Promise((resolve, reject) => {
    const salt = "1o1sqhmHcREdoi+137Rnug==";
    const combined = password + salt;
    const hash = crypto.createHash('sha256').update(combined).digest('base64');

    const postData = JSON.stringify({
      classId: "UserBiz",
      methodId: "doLogon",
      parameters: {
        empNo: username, // username 변수를 사용하여 동적으로 사용자 이름을 할당합니다.
        pwd: hash,
        systId: "10",
        cnntIp: "",
        deviceId: "",
        macAddr: "",
        latitd: "",
        longtd: "",
        bAutoLogin: false
      }
    });

    const options = {
      hostname: 'neosmobile.networkons.com',
      port: 80,
      path: '/RestFulAPI/ZZ/api/zznotreqauth/execute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      let data = '';


      res.on('data', (chunk) => {
        data += chunk;
      });


      res.on('end', () => {
        if (res.statusCode === 200) {
          const parsedData = JSON.parse(data);
          const base64Value = parsedData.result.value;
          const decodedValue = Buffer.from(base64Value, 'base64').toString('utf-8');
          const fields = decodedValue.split("\u0001");
          const keyValuePairs = fields.map(field => field.split("\u0002"));
          const authUserValue = keyValuePairs.find(pair => pair[0] === "AuthUser")?.[1];

          // 로그인 인증 성공 여부 확인
          if (authUserValue === "Y") {
            // console.log("로그인 인증 성공");
            // 성공적인 인증 처리, 예를 들어 사용자 정보를 resolve로 전달
            resolve({ success: true, message: "로그인 성공", authUserValue: authUserValue, keyValuePairs: keyValuePairs });
          } else {
            // authUserValue가 "Y"가 아닌 경우 실패 처리
            console.log("로그인 인증 실패");
            reject(new Error("로그인 인증 실패"));
          }

        } else {
          reject(new Error(`Request failed with status code: ${res.statusCode}`));
        }
      });

    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};

export { loginOpark };

