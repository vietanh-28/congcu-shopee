module.exports = async function handler(req, res) {
    const { url, platform } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Vui lòng cung cấp đường link" });
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        let finalUrl = response.url;

        if (finalUrl.includes('shopee.vn')) {
            try {
                let parsedUrl = new URL(finalUrl);
                
                // Đọc thông số nút bấm để gán thẻ tương ứng
                const source = (platform === 'youtube') ? 'youtube' : 'facebook';
                
                parsedUrl.searchParams.set('utm_source', source);
                parsedUrl.searchParams.set('utm_medium', 'affiliate');
                parsedUrl.searchParams.set('utm_campaign', 'exclusive_voucher');
                finalUrl = parsedUrl.toString();
            } catch (e) {
                // Bỏ qua nếu lỗi phân tích
            }

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
};
