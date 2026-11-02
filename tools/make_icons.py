"""Draws the app icon (cream crescent Moon and gold star on the header red) as PNGs."""
import struct
import sys
import zlib

BG = (0xB2, 0x3A, 0x2E)
MOON = (0xFB, 0xF8, 0xF2)
STAR = (0xF2, 0xB8, 0x4B)
SS = 4  # supersampling per axis


def shapes(scale):
    """Returns a function (x, y in 0..1) -> colour or None; `scale` shrinks art toward the centre."""
    def at(x, y):
        x = 0.5 + (x - 0.5) / scale
        y = 0.5 + (y - 0.5) / scale
        # Crescent: big disk minus an offset disk.
        if (x - 0.47) ** 2 + (y - 0.5) ** 2 < 0.30 ** 2 and not (
            (x - 0.60) ** 2 + (y - 0.42) ** 2 < 0.26 ** 2
        ):
            return MOON
        # Four-pointed star.
        dx, dy = abs(x - 0.70), abs(y - 0.50)
        if (dx ** 0.5 + dy ** 0.5) < 0.10 ** 0.5:
            return STAR
        return None
    return at


def png(path, size, scale, rounded):
    at = shapes(scale)
    rows = []
    for py in range(size):
        row = bytearray([0])
        for px in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(SS):
                for sx in range(SS):
                    x = (px + (sx + 0.5) / SS) / size
                    y = (py + (sy + 0.5) / SS) / size
                    if rounded:
                        # Rounded square, corner radius 22%.
                        r = 0.22
                        cx = min(max(x, r), 1 - r)
                        cy = min(max(y, r), 1 - r)
                        if (x - cx) ** 2 + (y - cy) ** 2 > r * r:
                            continue
                    c = at(x, y) or BG
                    acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; acc[3] += 255
            n = SS * SS
            a = acc[3] / n
            if a:
                k = 255 / a  # un-premultiply
                row += bytes([round(acc[0] / n * k), round(acc[1] / n * k), round(acc[2] / n * k), round(a)])
            else:
                row += bytes(4)
        rows.append(bytes(row))
    raw = zlib.compress(b"".join(rows), 9)

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)))
        f.write(chunk(b"IDAT", raw))
        f.write(chunk(b"IEND", b""))


out = sys.argv[1]
png(f"{out}/icon-192.png", 192, 1.0, True)
png(f"{out}/icon-512.png", 512, 1.0, True)
png(f"{out}/icon-maskable-512.png", 512, 0.78, False)  # art inside Android's safe zone
png(f"{out}/apple-touch-icon.png", 180, 0.9, False)
