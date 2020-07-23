export async function getData(url) {
  const response = await fetch(url);
  const json = await response.json();

  return json;
}

export async function postData(url, formData) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(formData),
  });
  const json = await response.json();

  return json;
}

export async function putData(url, formData) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(formData),
  });
  const json = await response.json();

  return json;
}

export async function deleteData(url) {
  const response = await fetch(url, {method: 'DELETE' });
  const json = await response.json();

  return json;
}
