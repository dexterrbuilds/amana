"use client"

import { ArrowRight, Play, ChevronLeft, ChevronRight, Star } from "lucide-react"
import "../styles/Home.css"

export default function Home() {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <a href="/" className="logo">
          <img src="amana.jpg" width={40} height={40} alt="Logo" />
          <span className="text-2xl font-semibold">AMANA</span>
        </a>
        <nav className="nav">
          <a href="/" className="navLink">
            Home
          </a>
          <a href="/learning-programs" className="navLink">
            Learning Programs
          </a>
          <a href="/about" className="navLink">
            About Us
          </a>
          <a href="/admission" className="navLink">
            Admission
          </a>
          <a className="secondaryButton">Eng</a>
          <a href="/login" className="primaryButton">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="heroContent">
          <h1 className="heroTitle">Let's Create a Brilliant Future with Our School</h1>
          <p className="heroText">
            Amana International School is a school that is committed to providing high-quality education and implementing
            IT-based curriculum.
          </p>
          <div className="heroButtons">
            <button className="primaryButton">
              Get Started <ArrowRight className="ml-2" size={16} />
            </button>
            <button className="secondaryButton">Get to Know more</button>
          </div>
          <div className="stats">
            <div className="statItem">
              <div className="statNumber">60+</div>
              <div className="statLabel">Teachers</div>
            </div>
            <div className="statItem">
              <div className="statNumber">2,5k</div>
              <div className="statLabel">Students</div>
            </div>
            <div className="statItem">
              <div className="statNumber">A+</div>
              <div className="statLabel">Rating</div>
            </div>
          </div>
        </div>
        <div className="relative h-[300px] rounded-xl overflow-hidden">
          <img src="none.png" alt="Students learning" className="object-cover" />
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <div className="partnerLogos">
          <img
            src="amana.jpg"
            alt="Oracle"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
          <img
            src="amana.jpg"
            alt="Python"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
          <img
            src="amana.jpg"
            alt="Cisco"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
          <img
            src="amana.jpg"
            alt="Microsoft"
            width={60}
            height={60}
            className="brightness-0 invert"
          />
        </div>
      </section>

      {/* Quality School Section */}
      <section className="qualitySchool sectionBlue">
        <h2 className="sectionTitle">Choose a Quality School for a Bright Future</h2>
        <div className="benefitsGrid">
          <div className="benefitCard">
            <div className="benefitIcon">
              <img src="col-md-6.png" alt="" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Students will be guided by the teacher to grow and develop</h3>
            <p className="text-gray-600 text-sm mb-4">
              The students can become graduates who are competent in the field of IT
            </p>
            <ArrowRight className="text-[#0052FF]" size={20} />
          </div>
          <div className="benefitCard">
            <div className="benefitIcon">
              <img src="col-md-6.png" alt="" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Students are mentally equipped to have big dreams</h3>
            <p className="text-gray-600 text-sm mb-4">
              The students can become graduates who are competent in the field of IT
            </p>
            <ArrowRight className="text-[#0052FF]" size={20} />
          </div>
          <div className="benefitCard">
            <div className="benefitIcon">
              <img src="col-md-6.png" alt="" width={24} height={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Beneficial for many students science and non science students</h3>
            <p className="text-gray-600 text-sm mb-4">
              The students can become graduates who are competent in the field of IT
            </p>
            <ArrowRight className="text-[#0052FF]" size={20} />
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos">
        <div className="flex items-center justify-between">
          <h2 className="sectionTitle">
            Discover Our Awesome
            <br />
            School Profile Videos
          </h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:border-[#0052FF]">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:border-[#0052FF]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="videoGrid">
          <div className="videoCard">
            <img
              src="/placeholder.svg?height=300&width=600"
              alt="School video"
              width={600}
              height={300}
              className="rounded-xl"
            />
            <div className="playButton">
              <div className="playIcon">
                <Play className="text-[#0052FF]" size={24} />
              </div>
            </div>
          </div>
          {/* Second video card */}
          <div className="videoCard">
            <img
              src="/placeholder.svg?height=300&width=600"
              alt="School video"
              width={600}
              height={300}
              className="rounded-xl"
            />
            <div className="playButton">
              <div className="playIcon">
                <Play className="text-[#0052FF]" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="sectionTitle">
          What Alumni Say
          <br />
          About Our School
        </h2>
        <div className="testimonialGrid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="testimonialCard">
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                "I'm incredibly grateful for the transformative experience at UP School! The hands-on learning
                approach..."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">Sarah Johnson</h4>
                  <p className="text-gray-500 text-xs">Class of 2023</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="ctaContent">
          <h2 className="text-4xl font-bold">Ready to join with us?</h2>
          <button className="primaryButton">
            Get Started Now <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footerColumn">
          <a href="/" className="logo">
            UP School
            <sup>k</sup>
          </a>
          <p className="text-sm text-gray-600">Platform based on 10 Years Experience</p>
        </div>
        {["Pages", "Profile", "Company"].map((title) => (
          <div key={title} className="footerColumn">
            <h3 className="footerTitle">{title}</h3>
            <div className="space-y-2">
              {["Home", "About", "Blog"].map((link) => (
                <a key={link} href="#" className="footerLink">
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </footer>
    </div>
  )
}
