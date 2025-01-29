export const handleUnauthorized = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

export const handleError = (err, setError, navigate) => {
  if (!err.response) {
    setError({
      non_field_errors: [
        "Unable to connect to server. Please check your connection.",
      ],
    });
    return;
  }

  if (err.response.status === 401) {
    handleUnauthorized(navigate);
    return;
  }

  const errors = err.response.data;
  if (typeof errors === "object") {
    console.log("🔥 API Errors:", errors); // ✅ Debug บน frontend
    setError(errors); // เก็บ error object ทั้งหมดลง state
  } else {
    setError({ non_field_errors: [errors || "Something went wrong."] });
  }
};
