const { unstable_dev } = require("wrangler");

describe("Worker", () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.js", {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return Hello World", async () => {
		const resp = await worker.fetch();
		if (resp) {
			const status = await resp.status;
			const text = await resp.text();

			expect(status).toBe(200);
			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});
});
