export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Vui lòng cung cấp đường link" });
    }

    try {
        // Gửi request đến link rút gọn và tự động đi theo (follow) để lấy link đích cuối cùng
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const finalUrl = response.url;

        // Nếu đích đến là Shopee, chuyển đổi thành Deep Link mở app
        if (finalUrl.includes('shopee.vn')) {
            // Thay thế https:// thành shopeevn:// để ép thiết bị di động mở ứng dụng
            const deepLink = finalUrl.replace(/^https?:\/\//, 'shopeevn://');
            
            return res.status(200).json({ 
                originalUrl: url,
                finalUrl: finalUrl,
                deepLink: deepLink
            });
        } else {
            return res.status(400).json({ error: "Đây không phải là link Shopee hợp lệ." });
        }

    } catch (error) {
        return res.status(500).json({ error: "Không thể xử lý đường link này." });
    }
}
