export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    // Check if the content type is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      data = { message: textData || 'Invalid response from server' };
    }

    if (!response.ok) {
      throw new Error(data.message || `API Request Failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error.message);
    throw error;
  }
};
