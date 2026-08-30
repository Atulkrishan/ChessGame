export function asyncHandler(handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: error.message
            }));
        }
    };
}