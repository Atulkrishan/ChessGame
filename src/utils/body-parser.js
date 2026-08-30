export async function parseJSONBody(req) {
    let rawData = "";

    try {
        for await (const chunk of req) {
            rawData += chunk.toString();
        }

        if (!rawData.trim()) {
            return {};
        }

        return JSON.parse(rawData);

    } catch (error) {
        throw new Error("Invalid JSON body");
    }
}