// لم نعد بحاجة لـ API_KEY لأننا نستخدم NoCodeAPI

// دالة للحصول على بيانات الطقس
async function getWeather() {
    const city = document.getElementById('city').value.trim();
    const resultDiv = document.getElementById('result');
    
    // التحقق من إدخال المدينة
    if (!city) {
        resultDiv.innerHTML = '<p class="error">⚠️ الرجاء إدخال اسم المدينة</p>';
        return;
    }
    
    // عرض رسالة التحميل
    resultDiv.innerHTML = '<p class="loading">⏳ جاري تحميل البيانات...</p>';
    
    try {
        // استدعاء API باستخدام NoCodeAPI
        const response = await fetch(
            `https://v1.nocodeapi.com/aminamahdi/ow/FJXjfroFunOzvjOf/weather?q=${city}&units=metric&lang=ar`
        );
        
        const data = await response.json();
        
        // التحقق من نجاح الطلب
        if (data.cod === 200) {
            displayWeatherData(data);
        } else if (data.cod === '404') {
            resultDiv.innerHTML = '<p class="error">❌ المدينة غير موجودة، تحقق من الاسم وجرب مرة أخرى</p>';
        } else {
            resultDiv.innerHTML = '<p class="error">❌ حدث خطأ في جلب البيانات</p>';
        }
    } catch (error) {
        console.error('خطأ:', error);
        resultDiv.innerHTML = '<p class="error">❌ حدث خطأ، تحقق من الاتصال بالإنترنت</p>';
    }
}

// دالة لعرض بيانات الطقس
function displayWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // تحويل من m/s إلى km/h
    const clothing = suggestClothing(temp, data.weather[0].main);
    const weatherEmoji = getWeatherEmoji(temp, data.weather[0].main);
    
    document.getElementById('result').innerHTML = `
        <div class="weather-icon">${weatherEmoji}</div>
        <h2>📍 ${data.name}</h2>
        <div class="temp">${temp}°C</div>
        <p><strong>الشعور بـ:</strong> ${feelsLike}°C</p>
        <p><strong>الوصف:</strong> ${description}</p>
        <p><strong>الرطوبة:</strong> ${humidity}%</p>
        <p><strong>سرعة الرياح:</strong> ${windSpeed} كم/س</p>
        
        <hr>
        
        <div class="clothing-suggestion">
            <h3>🧥 الملابس المناسبة</h3>
            <p>${clothing}</p>
        </div>
    `;
}

// دالة لاقتراح الملابس بناءً على درجة الحرارة
function suggestClothing(temp, weatherCondition) {
    let suggestion = '';
    
    // اقتراحات بناءً على درجة الحرارة
    if (temp > 35) {
        suggestion = '🩳 ملابس صيفية خفيفة جداً من القطن، قبعة واسعة، نظارة شمسية، وواقي من الشمس. احرص على شرب الماء بكثرة!';
    } else if (temp > 28) {
        suggestion = '👕 ملابس صيفية خفيفة وفضفاضة، قميص قطني، وقبعة للحماية من الشمس.';
    } else if (temp > 20) {
        suggestion = '👔 ملابس معتدلة، قميص بأكمام قصيرة أو طويلة، الجو مثالي للنزهة!';
    } else if (temp > 15) {
        suggestion = '🧥 كنزة خفيفة أو جاكيت رقيق، الجو منعش وبارد قليلاً.';
    } else if (temp > 10) {
        suggestion = '🧥 جاكيت متوسط السُمك، وربما وشاح خفيف.';
    } else if (temp > 5) {
        suggestion = '🧥 معطف شتوي ثقيل، قفازات، ووشاح دافئ.';
    } else {
        suggestion = '🧤 ملابس شتوية ثقيلة جداً، معطف سميك، قفازات، قبعة صوفية، ووشاح. الجو بارد جداً!';
    }
    
    // إضافة اقتراحات خاصة بالطقس
    if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
        suggestion += '<br><br>☔ لا تنسَ المظلة والمعطف المقاوم للماء!';
    } else if (weatherCondition === 'Snow') {
        suggestion += '<br><br>❄️ ارتدِ ملابس مقاومة للماء وأحذية مناسبة للثلج!';
    } else if (weatherCondition === 'Thunderstorm') {
        suggestion += '<br><br>⛈️ الجو عاصف! ابقَ في الداخل إن أمكن.';
    }
    
    return suggestion;
}

// دالة للحصول على emoji مناسب للطقس
function getWeatherEmoji(temp, weatherCondition) {
    // أولاً: التحقق من نوع الطقس
    switch(weatherCondition) {
        case 'Thunderstorm':
            return '⛈️';
        case 'Drizzle':
            return '🌦️';
        case 'Rain':
            return '🌧️';
        case 'Snow':
            return '❄️';
        case 'Mist':
        case 'Fog':
            return '🌫️';
        case 'Clouds':
            return '☁️';
        default:
            // إذا كان الطقس صافي، نختار بناءً على درجة الحرارة
            if (temp > 30) return '☀️';
            if (temp > 20) return '🌤️';
            if (temp > 10) return '⛅';
            return '🌥️';
    }
}

// دالة للسماح بالبحث عند الضغط على Enter
function handleEnter(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}
