import axios from 'axios';

const BASE = 'http://127.0.0.1:8000';

const listIssues = async () => {
  return await axios.get(`${BASE}/listIssues`);
}

const getIssue = async (issueId) => {
  return await axios.get(`${BASE}/getIssue/${issueId}`);
}

const createIssue = async (issueData) => {
  return await axios.post(`${BASE}/createIssue`, issueData);
}

const updateIssue = async (issueId, issueData) => {
  return await axios.put(`${BASE}/updateIssue/${issueId}`, issueData);
}

const deleteIssue = async (issueId) => {
  return await axios.delete(`${BASE}/deleteIssue/${issueId}`);
}

export { listIssues, getIssue, createIssue, updateIssue, deleteIssue };