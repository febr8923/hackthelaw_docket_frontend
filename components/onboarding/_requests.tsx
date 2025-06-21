export const post_request = async (n: string, m: string) => {
    //return ""
    const url = "/api/categories?name="+n+"&firm="+m;
    
    console.log("post_request called with URL:", n, " ", m);
    const api_key = process.env.GEMINI_API_KEY;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      "name": n,
      "firm": m
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    console.log("Response received:", response);
    const jsonResponse = await response.text();
    console.log("Response JSON:", jsonResponse);


const data = JSON.parse(jsonResponse);
return data.areas_of_interest;
}

export const post_request_report = async (n: string, m: string, cats: string) => {
    const url = "/api/report?name="+n+"&firm="+m;
    console.log("post_request called with URL:", url);
    const api_key = process.env.GEMINI_API_KEY;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`,
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    console.log("Response received:", response);
    const jsonResponse = await response.text();
    console.log("Response JSON:", jsonResponse);

  return jsonResponse;
}