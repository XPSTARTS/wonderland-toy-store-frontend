// pages/AboutUs.tsx
import { useState, useEffect } from 'react';
import { Award, Heart, Package, Shield, Truck, Users, Star, Mail, Phone, MapPin } from 'lucide-react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Products', icon: Package },
    { number: '50+', label: 'Brands', icon: Star },
    { number: '99%', label: 'Satisfaction', icon: Heart },
  ];

  const values = [
    { icon: Heart, title: 'Quality First', description: 'We ensure every toy meets the highest safety and quality standards.' },
    { icon: Truck, title: 'Fast Delivery', description: 'Free shipping on orders over Rs 5000 with delivery within 3-5 days.' },
    { icon: Shield, title: 'Secure Shopping', description: 'Your privacy and security are our top priorities.' },
    { icon: Award, title: 'Best Selection', description: 'Curated collection of the finest toys from around the world.' },
  ];

  const team = [
    { name: 'Abdul Moid', role: 'Founder & CEO', image: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=Abdul+Moid', delay: '0s' },
    { name: 'Sarah Johnson', role: 'Product Curator', image: 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=Sarah+J', delay: '0.1s' },
    { name: 'Michael Chen', role: 'Operations Manager', image: 'https://ui-avatars.com/api/?background=06b6d4&color=fff&name=Michael+C', delay: '0.2s' },
    { name: 'Emma Wilson', role: 'Customer Happiness', image: 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=Emma+W', delay: '0.3s' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">About Wonderland Toys</h1>
            <p className="text-xl text-blue-100 mb-6">Bringing joy to children and families since 2024</p>
            <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 transform delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-1">
                <div className="bg-white rounded-xl p-8">
                  <div className="text-6xl mb-4">🧸</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Founded in 2024 by <span className="font-semibold text-blue-600">Abdul Moid</span>, Wonderland Toys was born from 
                    a simple belief: every child deserves access to safe, high-quality toys that spark imagination and creativity.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    What started as a small online store has grown into a beloved destination for parents, 
                    gift-givers, and collectors across Pakistan. We handpick every product to ensure it meets 
                    our strict standards for safety, durability, and play value.
                  </p>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-700 transform delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop" 
                  alt="Toys collection" 
                  className="rounded-2xl shadow-lg h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop" 
                  alt="Happy child" 
                  className="rounded-2xl shadow-lg h-48 w-full object-cover hover:scale-105 transition-transform duration-300 mt-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop" 
                  alt="Toy store" 
                  className="rounded-2xl shadow-lg h-48 w-full object-cover hover:scale-105 transition-transform duration-300 -mt-4"
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Making a difference one toy at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`text-center p-6 border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Passionate people dedicated to bringing joy to families</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div 
                key={index}
                className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: member.delay }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gradient-to-r from-blue-600 to-indigo-600"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-blue-100 mb-6">Have questions? We'd love to hear from you!</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>hello@wonderlandtoys.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>+92 300 1234567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>Karachi, Pakistan</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <p className="text-center text-blue-100 mb-2">Created with ❤️ by</p>
                <p className="text-center text-2xl font-bold">Abdul Moid</p>
                <p className="text-center text-blue-100 text-sm mt-2">Founder & CEO, Wonderland Toys</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;