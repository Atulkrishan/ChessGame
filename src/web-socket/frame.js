
export const OPCODES = {
    TEXT: 0x1,
    BINARY: 0x2,
    CLOSE: 0x8,
    PING: 0x9,
    PONG: 0xa
};


export function decodeFrame(buffer) {
    const firstByte = buffer[0];
    const opcode = firstByte & 0x0f;

    const secondByte = buffer[1];
    const isMasked = (secondByte & 0x80) !== 0;
    let payloadLength = secondByte & 0x7f;

    let offset = 2;

    
    if (payloadLength === 126) {
        payloadLength = buffer.readUInt16BE(offset);
        offset += 2;
    } else if (payloadLength === 127) {
        payloadLength = Number(buffer.readBigUInt64BE(offset));
        offset += 8;
    }

    let maskKey;
    if (isMasked) {
        maskKey = buffer.subarray(offset, offset + 4);
        offset += 4;
    }

    const payloadBuffer = buffer.subarray(offset, offset + payloadLength);

    let payload;
    if (isMasked) {
        
        payload = Buffer.alloc(payloadLength);
        for (let i = 0; i < payloadLength; i++) {
            payload[i] = payloadBuffer[i] ^ maskKey[i % 4];
        }
    } else {
        payload = payloadBuffer;
    }

    return { opcode, payload };
}


export function encodeFrame(data, opcode = OPCODES.TEXT) {
    const payload = Buffer.from(data);
    const payloadLength = payload.length;

    let header;

    if (payloadLength < 126) {
        header = Buffer.alloc(2);
        header[0] = 0x80 | opcode; 
        header[1] = payloadLength;
    } else if (payloadLength < 65536) {
        header = Buffer.alloc(4);
        header[0] = 0x80 | opcode;
        header[1] = 126;
        header.writeUInt16BE(payloadLength, 2);
    } else {
        header = Buffer.alloc(10);
        header[0] = 0x80 | opcode;
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(payloadLength), 2);
    }

    return Buffer.concat([header, payload]);
}