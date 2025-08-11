/**
 * 株式会社ESK官网 - JavaScript交互功能
 * 功能包括：图片懒加载、平滑滚动、响应式菜单、住宿分类筛选
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化所有功能模块
    initLazyLoading();
    initSmoothScrolling();
    initMobileMenu();
    initStayCategories();
    initScrollAnimations();
    initHeaderScroll();
    
});

/**
 * 图片懒加载功能
 * 使用Intersection Observer API实现高性能懒加载
 */
function initLazyLoading() {
    // 检查浏览器是否支持Intersection Observer
    if ('IntersectionObserver' in window) {
        
        // 创建观察器实例
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 加载图片
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // 添加加载完成的类名
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    
                    // 停止观察这个图片
                    observer.unobserve(img);
                }
            });
        }, {
            // 当图片距离视口50px时开始加载
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // 观察所有带有loading="lazy"属性的图片
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            // 将src属性移动到data-src
            if (img.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4=';
            }
            imageObserver.observe(img);
        });
    }
}

/**
 * 平滑滚动导航功能
 * 为导航链接添加平滑滚动效果
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 计算目标位置（考虑固定头部的高度）
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // 执行平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 移动端菜单功能
 * 处理移动端汉堡菜单的展开/收起
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navList = document.querySelector('.header__nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // 切换菜单状态
            this.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('header__nav-list--active');
            
            // 添加动画类名
            menuToggle.classList.toggle('header__menu-toggle--active');
        });
        
        // 点击菜单项后自动关闭移动菜单
        const navLinks = navList.querySelectorAll('.header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('header__nav-list--active');
                menuToggle.classList.remove('header__menu-toggle--active');
            });
        });
    }
}

/**
 * 住宿分类筛选功能
 * 实现住宿类型的动态筛选显示
 */
function initStayCategories() {
    const categoryButtons = document.querySelectorAll('.stay-category');
    const stayCards = document.querySelectorAll('.stay-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            
            // 更新按钮状态
            categoryButtons.forEach(btn => btn.classList.remove('stay-category--active'));
            this.classList.add('stay-category--active');
            
            // 筛选卡片显示
            stayCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * 滚动动画功能
 * 元素进入视口时触发动画效果
 */
function initScrollAnimations() {
    // 检查浏览器是否支持Intersection Observer
    if ('IntersectionObserver' in window) {
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // 观察需要动画的元素
        const animateElements = document.querySelectorAll('.stay-card, .experience-card, .stay-section__header, .experiences-section__header');
        animateElements.forEach(el => {
            animationObserver.observe(el);
        });
    }
}

/**
 * 头部滚动效果
 * 滚动时改变头部背景透明度
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 改变头部背景透明度
        if (scrollTop > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        // 向上滚动时显示头部，向下滚动时隐藏
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * 图片加载错误处理
 * 为图片添加错误处理和占位符
 */
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // 创建占位符
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE3NVYxNzVIMjI1VjEyNUgxNzVaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwVjIwMEgyNTBWMTAwSDE1MFpNMjI1IDE3NUgxNzVWMTI1SDIyNVYxNzVaIiBmaWxsPSIjQ0NDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPuWbvueJh+WKoOi9veS4rTwvdGV4dD4KPC9zdmc+';
            this.alt = '图片加载中...';
        });
    });
}

/**
 * 键盘可访问性支持
 * 为交互元素添加键盘导航支持
 */
function initKeyboardAccessibility() {
    // 为自定义按钮添加键盘支持
    const customButtons = document.querySelectorAll('.stay-card__button, .stay-category');
    
    customButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            // 当按下回车键或空格键时触发点击事件
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * 性能优化 - 防抖函数
 * 限制函数的执行频率
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 性能优化 - 节流函数
 * 限制函数的执行频率
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 应用防抖和节流优化到滚动事件
window.addEventListener('scroll', throttle(initHeaderScroll, 16)); // 约60fps

// 应用防抖优化到窗口大小变化事件
window.addEventListener('resize', debounce(() => {
    // 窗口大小变化时的处理逻辑
    console.log('Window resized');
}, 250));

/**
 * 添加页面加载完成后的初始化
 */
window.addEventListener('load', function() {
    // 处理图片加载错误
    handleImageErrors();
    
    // 初始化键盘可访问性
    initKeyboardAccessibility();
    
    // 页面加载完成动画
    document.body.classList.add('page-loaded');
});

/**
 * 服务工作者（Service Worker）注册
 * 用于缓存优化和离线支持
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}







