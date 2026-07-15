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
            const source = (platform === 'youtube') ? 'youtube' : 'facebook';
            
            // Nối trực tiếp thông số vào link để không làm hỏng cấu trúc tiếng Việt của Shopee
            const extraParams = `utm_source=${source}&utm_medium=affiliate&utm_campaign=exclusive_voucher`;
            
            if (finalUrl.includes('?')) {
                finalUrl = finalUrl + '&' + extraParams;
            } else {
                finalUrl = finalUrl + '?' + extraParams;
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
