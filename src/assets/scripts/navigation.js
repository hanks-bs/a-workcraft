window.addEventListener("load", () => {
	const animateNavigaton = () => {
		const button = document.querySelector(".menu--close2");
		const navigation = document.querySelector("nav");
		const menuItems = document.querySelectorAll("nav li");

		button.addEventListener("click", e => {
			button.classList.toggle("open");
			navigation.classList.toggle("active");
		});

		menuItems.forEach(element => {
			element.querySelector("a").addEventListener("click", e => {
				if (element.querySelector("a[href^='#']")) e.preventDefault();

				if (element.querySelector("a[href^='#']")) {
					gsap.to(window, {
						duration: 0.5,
						scrollTo: {
							y: element.querySelector("a").getAttribute("href"),
							offsetY: 150,
						},
					});
				}
			});
		});
	};

	animateNavigaton();
});
