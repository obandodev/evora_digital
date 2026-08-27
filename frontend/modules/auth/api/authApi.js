const API_URL =
    "/glam_beauty/backend/modules/auth/index.php";

export async function loginAdmin(email, password) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const response = await fetch(
        `${API_URL}?action=login`,
        {
            method: "POST",
            body: formData,
            credentials: "include"
        }
    );
    const data = await response.json();
    return {
        ok: response.ok,
        data
    };
}