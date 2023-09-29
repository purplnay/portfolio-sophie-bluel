document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#login form");

    // Wait for form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const email = data.get("email");
        const password = data.get("password");

        let res;

        try {
            res = await fetch(`${API}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
        } catch {
            return alert("Une erreur est survenue.");
        }

        switch (res.status) {
            case 401:
                alert("Les données du formulaire sont invalides.");
                break;
            case 404:
                alert("L'utilisateur n'existe pas.");
                break;
            default:
                let json;
                try {
                    json = await res.json();
                } catch {
                    return alert("Une erreur est survenue.");
                }

                localStorage.setItem("userId", json.userId);
                localStorage.setItem("token", json.token);
                window.location.href = "/";
        }
    });
});
